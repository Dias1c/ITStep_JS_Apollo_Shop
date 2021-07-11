const resolvers = {
    Query: {
        products: async (parent, args, context, info) => {
            const filter = args.filter ? args.filter : {};
            console.log("Query: ", filter)
            const products = await context.prisma.products.findMany({
                where: {
                    Name: {
                        contains: filter.Name
                    },
                    Cost: filter.Cost,
                    Categories: {
                        Name: args.CategoryName
                    }
                },
                skip: args.skip,
                take: args.take,
                orderBy: {
                    Cost: args.orderBy
                },
                include: {
                    Categories: true,
                }
            });
            return products;
        },
        product: async (parent, args, context, info) => {
            const product = await context.prisma.products.findUnique({
                where: {
                    Product_ID: args.id
                },
                include: {
                    Categories: true,
                }
            });
            return product;
        },
        categories: async (parent, args, context, info) => {
            const filter = args.filter ? args.filter : {};
            const categories = await context.prisma.categories.findMany({
                where: filter,
            });
            return categories;
        },
        category: async (parent, args, context, info) => {
            const category = await context.prisma.categories.findUnique({
                where: {
                    Category_ID: args.id
                },
            });
            return category;
        }
    },
    //     Mutation: {
    //         createUser: async (parent, args, context, info) => {
    //             try {
    //                 const user = await context.prisma.user.create({
    //                     data: args.input,
    //                 })
    //                 return user;
    //             } catch (e) {
    //                 console.log(e);
    //                 return null;
    //             }
    //         },
    //         updateUser: async (parent, args, context, info) => {
    //             try {
    //                 const user = await context.prisma.user.update({
    //                     where: {
    //                         id: args.id
    //                     },
    //                     data: args.input,
    //                 });
    //                 return user;
    //             } catch (e) {
    //                 console.log(e);
    //                 return null;
    //             }
    //         },
    //         deleteUser: async (parent, args, context, info) => {
    //             try {
    //                 const posts = await context.prisma.post.deleteMany({
    //                     where: {
    //                         authorId: args.id
    //                     }
    //                 });
    //                 const user = await context.prisma.user.delete({
    //                     where: {
    //                         id: args.id
    //                     },
    //                 });
    //                 return user;
    //             }
    //             catch (e) {
    //                 console.log(e);
    //                 return null;
    //             }
    //         },
    //         createPost: async (parent, args, context, info) => {
    //             try {
    //                 const post = await context.prisma.post.create({
    //                     data: args.input,
    //                 });
    //                 return post;
    //             }
    //             catch (e) {
    //                 console.log(e);
    //                 return null;
    //             }
    //         },
    //         updatePost: async (parent, args, context, info) => {
    //             try {
    //                 const post = await context.prisma.post.update({
    //                     where: {
    //                         id: args.id
    //                     },
    //                     data: args.input
    //                 });
    //                 return post;
    //             }
    //             catch (e) {
    //                 console.log(e);
    //                 return null;
    //             }
    //         },
    //         deletePost: async (parent, args, context, info) => {
    //             try {
    //                 const post = await context.prisma.post.delete({
    //                     where: {
    //                         id: args.id
    //                     }
    //                 });
    //                 return post;
    //             }
    //             catch (e) {
    //                 console.log(e);
    //                 return null;
    //             }
    //         }
    //     }
}

exports.resolvers = resolvers