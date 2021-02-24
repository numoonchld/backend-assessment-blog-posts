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

// helper function: to combine and get unique posts ------------------------------
function combineAndUnique(cache, queryTagsArray) {

    const fullCacheDeepClone = JSON.parse(JSON.stringify(cache))

    if (queryTagsArray.length === 1) {

        return cache[queryTagsArray[0]]

    } else {

        const postTagComboSet = new Set()
        let mergedPostArrays = []
        let finalPostsArray = []

        for (const queryTag of queryTagsArray) {
            // console.log('LOG 0: ', queryTag, fullCacheDeepClone[queryTag].length)

            mergedPostArrays = mergedPostArrays.concat(fullCacheDeepClone[queryTag])


            for (const post of fullCacheDeepClone[queryTag]) {
                // console.log(post.id, post)
                postTagComboSet.add(post.id)

            }
        }

        // console.log('LOG 0: ', postTagComboSet.size, mergedPostArrays.length)

        for (const postID of postTagComboSet) {

            uniquePost = mergedPostArrays.filter(post => post.id === postID)[0]
            finalPostsArray.push(uniquePost)

        }
        // console.log(finalPostsArray.length)
        return finalPostsArray
    }

}

// helper function: check if sortBy parameter is valid ---------------------------
function isSortByValid(sortByParam) {
    if (sortByParam === 'id' || sortByParam === 'reads' || sortByParam === 'likes' || sortByParam === 'popularity') {
        return true
    }
    return false
}

// helper function: check if direction parameter is valid ----------------------
function isDirectionValid(directionParam) {
    if (directionParam === 'asc' || directionParam === 'desc') {
        return true
    }
    return false

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
            res.status(400)
            res.send({ error: 'Tags parameter is required' })
        } else {
            queryItems = req.query

            // cache tag API data
            const queryTagsArray = req.query.tags.split(',')

            for (const queryTag of queryTagsArray) {

                if (!cache[queryTag]) {

                    await fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${queryTag}`)
                        .then(response => response.json())
                        .then(payload => {
                            cache[queryTag] = payload.posts
                        })

                }

            }


            // sort-by phase ------------------------------------

            const sortByParam = req.query.sortBy
            const direction = req.query.direction


            if (!sortByParam && !direction) {

                const finalPostsArray = combineAndUnique(cache, queryTagsArray)

                res.send({ posts: finalPostsArray })

            } else if (!sortByParam && direction) {

                res.status(400)
                res.send({ error: 'sortBy parameter is needed if direction is specified' })

            } else if (sortByParam && !direction) {

                if (!isSortByValid(sortByParam)) {
                    res.status(400)
                    res.send({ error: 'sortBy parameter is invalid' })
                } else {
                    const finalPostsArray = combineAndUnique(cache, queryTagsArray)
                    finalPostsArray.sort((postA, postB) => postA[sortByParam] - postB[sortByParam])
                    res.send({ posts: finalPostsArray })

                }

            } else if (sortByParam && direction) {

                if (!isDirectionValid(direction)) {
                    res.status(400)
                    res.send({ error: 'direction parameter is invalid' })
                } else if (!isSortByValid(sortByParam)) {
                    res.status(400)
                    res.send({ error: 'sortBy parameter is invalid' })
                } else {
                    const finalPostsArray = combineAndUnique(cache, queryTagsArray)

                    if (direction === 'asc') {
                        finalPostsArray.sort((postA, postB) => postA[sortByParam] - postB[sortByParam])

                    } else if (direction === 'desc') {

                        finalPostsArray.sort((postA, postB) => postB[sortByParam] - postA[sortByParam])
                    }

                    res.send({ posts: finalPostsArray })
                }

            } else {
                res.status(400)
                res.send({ error: 'Unsupported request!' })
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