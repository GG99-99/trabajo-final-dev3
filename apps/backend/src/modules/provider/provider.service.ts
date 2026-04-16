import { providerModel } from "./provider.model.js"
import { GetProvider, CreateProvider } from "@final/shared"

export const providerSerice = {
    /*********
    |   READ  |
     *********/
    get: async (filters: GetProvider) => {
        return await providerModel.get(filters)
    },
    getMany: async () => {
        return await providerModel.getMany()
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateProvider) => {
        return await providerModel.create(data)
    }
}