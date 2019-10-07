import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredtitle = '';
  enteredcontent = '';
  @Output() postcreated = new EventEmitter<Post>();
  postservice: PostsService;
  route: ActivatedRoute;
  // the following 3 variables are for updation
  mode = 'create';
  postId: string = null;
  post: Post = null;

  // For Spinner
  isloading = false;

  constructor(postservice: PostsService, route: ActivatedRoute) {
    this.postservice = postservice;
    this.route = route;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // Start Progress Spinner
        this.isloading = true;
        this.postservice.getPost(this.postId).subscribe(postData => {
          // Stop Progress Spinner
          this.isloading = false;
          console.log(postData);
          this.post = {_id: postData._id, title: postData.title, content: postData.content};
        });
        console.log('Edit Mode');
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    /*const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postcreated.emit(post);*/

    // Start Progress Spinner
    this.isloading = true;

    if (this.mode === 'create') {
      this.postservice.addPost(form.value.title, form.value.content);
    } else {
      this.postservice.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
  }
}
