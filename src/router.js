import { createWebHistory, createRouter } from "vue-router";
import Cookie from 'js-cookie'
import LayoutCMS from './layouts/LayoutCMS.vue';

const routes = [
    {
        path: "/",
        component: LayoutCMS,
        children: [
            { path: '/mail/:user', name: 'list mail', component: () => import('./pages/cms/Home.vue') },
            { path: '/mail/:user/:id', name: 'detail mail', component: () => import('./pages/cms/Detail.vue') },
        ]
    },
    {
        path: "/login",
        name: 'login',
        component: () => import("./pages/cms/Login.vue")
    },

    { path: '/:pathMatch(.*)', redirect: '/404' },
    { path: '/404', name: 'pageNotFound', component: () => import("./pages/PageNotFound.vue") }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = Cookie.get("access_token");
    if (!isAuthenticated && to.name != 'login') {
        // Redirect to the login route if not authenticated
        next({ name: 'login' });
    } else if (isAuthenticated && to.name == 'login') {
        next({ path: '/' });
    } else {
        // Scroll to the top when changing route
        window.scrollTo(0, 0);
        // Proceed with the navigation
        next();
    }
});

export default router;