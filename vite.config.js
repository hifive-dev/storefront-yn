import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: [
      'medcu511ko5iop67dpvqn7g.nomodo.app',
      'stocu52cko5iop67dpvqttg.nomodo.app',
      'admin.younithy.com',
      'store.younithy.com',
      'younithy.com',
    ],
  },
})