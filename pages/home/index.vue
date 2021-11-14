<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">拉钩教育</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  :to="{ name: 'home', query: { tab: 'your_feed' } }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  :to="{ name: 'home', query: { tab: 'global_feed' } }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tag === 'tag' }"
                  :to="{ name: 'home', query: { tab: 'tag', tag: tag } }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            v-for="item in articles"
            :key="item.slug"
            class="article-preview"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: { username: item.author.username },
                }"
                ><img :src="item.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: { username: item.author.username },
                  }"
                  class="author"
                  >{{ item.author.username }}</nuxt-link
                >
                <span class="date">{{ item.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: item.favorited }"
                @click="onFavorite(item)"
                :disabled="item.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ item.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{ name: 'article', params: { slug: item.slug } }"
              class="preview-link"
            >
              <h1>{{ item.title }}</h1>
              <p>{{ item.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag',
                  },
                }"
                v-for="item in tags"
                :key="item"
                class="tag-pill tag-default"
                >{{ item }}</nuxt-link
              >
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="col-md-9">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ active: item === page }"
              v-for="item in totalPage"
              :key="item"
            >
              <nuxt-link
                :to="{
                  naame: 'home',
                  query: { page: item, tag: $route.query.tag ,tab:tab},
                }"
                class="page-link"
                >{{ item }}</nuxt-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles,getFeedArticles,addFavorite,deleteFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";

export default {
  name: "HomeIndex",
  // data() {
  //   return {
  //     articles: [],
  //     articlesCount: 0,
  //     limit: 2,
  //     page: 0,
  //     tags: [],
  //     tag: "",
  //     tab: "",
  //   };
  // },
  async asyncData({ query,store }) {
     const page = Number.parseInt(query.page || 1);
      const limit = 2;
      const { tag } = query;
      const tab = query.tab || "global_feed"
      const loadArticles = store.state.user&&tab === 'your_feed' ?getFeedArticles : getArticles
      const [articlesRes, tagRes] = await Promise.all([
        loadArticles({
          limit,
          offset: (page - 1) * limit,
          tag,
        }),
        getTags(),
      ]);
      const { articles, articlesCount } = articlesRes.data;
      const { tags } = tagRes.data;
      articles.forEach(article =>article.favoriteDisabled=false)
      return {
        articles,
        articlesCount,
        tags,
        limit,
        page,
        tag,
        tab:query.tab || "global_feed"
      }
  },
  watchQuery:['page','tag','tab'],
  created() {
    // this.init();
  },
  methods: {
    // async init() {
    //   const page = Number.parseInt(this.$route.query.page || 1);
    //   const limit = 2;
    //   // const { data } = await
    //   // const {data:tagData} = await
    //   const { tag } = this.$route.query;
    //   const tab = this.$route.query.tab || "global_feed"
    //   const loadArticles = this.user&&tab === 'your_feed' ?getFeedArticles : getArticles
    //   const [articlesRes, tagRes] = await Promise.all([
    //     loadArticles({
    //       limit,
    //       offset: (page - 1) * limit,
    //       tag,
    //     }),
    //     getTags(),
    //   ]);
    //   const { articles, articlesCount } = articlesRes.data;
    //   const { tags } = tagRes.data;
    //   articles.forEach(article =>article.favoriteDisabled=false)

    //   console.log(articlesRes);
    //   this.articles = articles;
    //   this.articlesCount = articlesCount;
    //   this.limit = limit;
    //   this.page = page;

    //   this.tag = tag;
    //   this.tags = tags;
    //   this.tab = tab;
    // },
    async onFavorite(article){
      article.favoriteDisabled = true
      if(article.favorited){
        //取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1

      }else{
        //添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1

      }
      article.favoriteDisabled = false
    }
  },
  watch: {
    // "$route.query": {
    //   handler() {
    //     this.init();
    //   },
    //   deep: true,
    // },
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
};
</script>

<style>
</style>