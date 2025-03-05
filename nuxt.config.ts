// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  // Include Nitro server configuration
  nitro: {
    experimental: {
      // This will help with node modules resolution in server routes
      openAPI: true,
    },
  },
})