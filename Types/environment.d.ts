export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            HOST: string
            PORT: number
            USERNAME: string
            PASSWORD: string
        }
    }
}