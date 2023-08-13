// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/', 
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {title: "Abi's List"}, 
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: {title: "About - Abi's List"}
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(to =>{
  document.title = to.meta.title
})

export default router
