import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsupdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/psql')
      // pipe is used combine map function that maps the returned object to another object type
      .pipe(map((postdata) => {
        return postdata.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            _id: post._id
          };
        });
      }))
      // pipe function returns only posts
      .subscribe((posts) => {
        this.posts = posts;
        this.postsupdated.next([...this.posts]);
      });
    // return [...this.posts];
    // ... <- Used for extracting a deep copy of the array
  }

  getPostUpdateListener() {
    return this.postsupdated.asObservable();
  }

  addPost(title1: string, content1: string) {
    const post: Post = {_id: null, title: title1, content: content1};
    this.http.post<{message: string, postid: string}>('http://localhost:3000/api/psql', post)
      // responsedata has the data returned by app.post of the express app
      .subscribe((responsedata) => {
        // console.log(responsedata.message);
        const id = responsedata.postid;
        post._id = id;
        this.posts.push(post);
        this.postsupdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(postid: string, title: string, content: string) {
    const post: Post = {_id: postid, title: title, content: content};
    this.http.put('http://localhost:3000/api/psql/' + postid, post)
      .subscribe((response) => {
        // console.log(response);
        // Update the posts array locally in the frontend
        const posts2 = [...this.posts];
        const oldIndex = posts2.findIndex(p => p._id === post._id);
        posts2[oldIndex] = post;
        this.posts = posts2;
        this.postsupdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    // return {...this.posts.find(p => p._id === id)};
    // Dont subscribe to the http request here, do it in the frontend code
    return this.http.get<Post>('http://localhost:3000/api/psql/' + id);
  }

  deletePost(postid: string) {
    this.http.delete('http://localhost:3000/api/psql/' + postid)
      .subscribe(() => {
        // console.log('Deleted');
        // Delete the post in the local frontend posts array
        const postsremaining = this.posts.filter(post => post._id !== postid);
        this.posts = postsremaining;
        this.postsupdated.next([...this.posts]);
      });
  }
}
