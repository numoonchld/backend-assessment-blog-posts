'use-strict'
// import dependencies ------------------------------------------------------------
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

// initialization ------------------------------------------------------------
const app = express()

// middleware ------------------------------------------------------------
app.use(cors()) // use cors in app 
app.use(express.json()) // get only body of request from client side

// process data ---------------------------------------------------------------
function combineAndUnique(cache, queryTagsArray) {

    const fullCacheDeepClone = JSON.parse(JSON.stringify(cache))

    if (queryTagsArray.length === 1) {

        return cache[queryTagsArray[0]]

    } else {

        const postTagComboSet = new Set()
        let mergedPostArrays = []
        let finalPostsArray = []

        for (const queryTag of queryTagsArray) {
            console.log('LOG 0: ', queryTag, fullCacheDeepClone[queryTag].length)

            mergedPostArrays = mergedPostArrays.concat(fullCacheDeepClone[queryTag])


            for (const post of fullCacheDeepClone[queryTag]) {
                // console.log(post.id, post)
                postTagComboSet.add(post.id)

            }
        }

        console.log('LOG 0: ', postTagComboSet.size, mergedPostArrays.length)

        for (const postID of postTagComboSet) {
            
            uniquePost = mergedPostArrays.filter(post => post.id === postID)[0]
            finalPostsArray.push(uniquePost)

        }
        console.log(finalPostsArray.length)
        return finalPostsArray
    }

}

//// api end points ------------------------------------------------------------
// route 1: /api/ping, GET
app.get('/api/ping', async (req, res) => {
    try {

        const responsePayload = {
            'success': true
        }

        res.json(responsePayload)

    } catch (error) {
        console.log(error)

        const responsePayload = {
            'success': false
        }

        res.json(responsePayload)
    }
})

// route 2: /api/posts
let cache = {}
app.get('/api/posts', async (req, res) => {
    try {

        // tags query check
        if (!req.query.tags) {
            res.status(500)
            res.send({ error: 'Tags parameter is required' })
        } else {
            queryItems = req.query
            console.log('LOG 1: ', queryItems)


            // cache tag API data
            const queryTagsArray = req.query.tags.split(',')

            for (const queryTag of queryTagsArray) {

                if (!cache[queryTag]) {

                    console.log('No Cache found! - Creating cache entry for given tag query.')

                    await fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${queryTag}`)
                        .then(response => response.json())
                        .then(payload => {
                            cache[queryTag] = payload.posts
                        })
                } else {

                    console.log('Query found in cache! - Using that for further processing.')

                }
            }

            // console.log(cache)

            // sort by phase 

            const sortByParam = req.query.sortBy
            console.log(sortByParam)

            const direction = req.query.direction
            console.log(direction)

            if (!sortByParam && !direction) {

                const finalPostsArray = combineAndUnique(cache, queryTagsArray)

                res.send({ posts: finalPostsArray })

            } else if (!sortByParam && direction) {

            } else if (sortByParam && !direction) {

            } else if (sortByParam && direction) {

            } else {
                res.send({ info: 'End-point under construction!' })
            }




        }



    } catch (error) {
        console.log(error.message)
    }
})


//  server listen 
app.listen(3000, '0.0.0.0', () => {
    console.log('NodeJS server started on port 3000')
})

module.exports = app