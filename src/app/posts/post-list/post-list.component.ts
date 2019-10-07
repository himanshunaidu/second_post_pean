import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  /*posts = [
    {title: 'First Post', content: 'This is the first post'},
    {title: 'Second Post', content: 'This is the first post'},
    {title: 'Third Post', content: 'This is the third post'}
  ];
  @Input() posts: Post[] = [];*/
  posts: Post[] = [];
  postservice: PostsService;
  postsub: Subscription;

  // For Spinner
  isloading = false;

  constructor(postservice: PostsService) {
    this.postservice = postservice;
  }

  ngOnInit() {
    // Start Spinner
    this.isloading = true;
    this.postservice.getPosts();
    this.postsub = this.postservice.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        // Stop Spinner
        this.isloading = false;
        this.posts = posts;
      });
  }

  onDelete(postid: string) {
    this.postservice.deletePost(postid);
  }

  ngOnDestroy() {
    this.postsub.unsubscribe();
  }

}
