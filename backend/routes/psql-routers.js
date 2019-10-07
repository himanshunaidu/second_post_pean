const express = require('express');
const router = express.Router();

const Post = require('../models/post');

const pg = require('pg');

//Id generator
const idgen = require('../helpers/idgen');

//This router is called only when we are using the localhost:3000/api/posts

//Connect to the psql database

const Pool = pg.Pool;
const pool = new Pool({
  user: '<USER>',
  host: '<HOST>',
  database: '<DATABASE>',
  password: '<PASSWORD>',
  port: 00000
});

// To get the psql data
const getPosts = (request, response, next) => {
  get_query = 'SELECT * from posts_himanshu';
  pool.query(get_query, (error, results) => {
    if (error) {
      throw error
    }
    return response.status(200).json({
      message: 'Posts fetched successfully',
      posts: results.rows
    });
  });
}

router.get('', getPosts);

// To get the psql data of particular id
const getPostById = (request, response, next) => {
  get_query = `SELECT * from posts_himanshu where _id='${request.params.id}'`;
  console.log(get_query);
  pool.query(get_query, (error, results) => {
    if (error) {
      throw error
    }
    if(results!=null){
      response.status(200).json(results.rows[0]);
    }
    else{
      response.status(404).json({message: 'Post not found'});
    }
  });
}

router.get('/:id', getPostById);

// To insert a post in psql
const insertPost = (request, response, next) => {
  _id = idgen(10);
  title = request.body.title;
  content = request.body.content;
  insert_query = `INSERT into posts_himanshu (title, content) values ('${title}', '${content}')`;

  pool.query(insert_query, (error, results) => {
    return response.status(201).json({
      message: 'Post added successfully',
      postid: _id
    });
  });
}

router.post('', insertPost);

// To delete a post
const deletePostById = (request, response, next) => {
  delete_query = `DELETE from posts_himanshu where _id='${request.params._id}';`
  console.log(delete_query);
  pool.query(delete_query, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results);
    response.status(200).json({
      message: 'Post deleted successfully'
    });
  });
}

router.delete('/:_id', deletePostById);

const updatePostById = (request, response, next) => {
  _id = request.params.id;
  title = request.body.title;
  content = request.body.content;

  update_query = `UPDATE posts_himanshu SET title='${title}', content='${content}' where _id='${_id}'`;
  console.log(update_query);
  pool.query(update_query, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results);
    response.status(200).json({
      message: 'Post updated successfully'
    });
  });
}

router.put('/:id', updatePostById);

module.exports = router;
