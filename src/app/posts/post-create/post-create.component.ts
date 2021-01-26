import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = '';
  private postId: string | null = '';
  post: { id?: string; title?: string; content?: string };
  isLoading = false;
  //post: Post;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('postId')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId!)
        .subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content};
          this.isLoading = false;
        });


        // ! this is  non-null assertion operator.
        //Here  ! is used to tell the compiler that postId is not null. as return-type of paramMap.get() is string | null.
        //that means it can return either string or null value. But postsService.getPost() can't take null as argument,
        //as in posts.service.ts file getpost is define as getPost(id:string).

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {

      this.postsService.updatePost(
        this.postId!,
        form.value.title,
        form.value.content
      );
    }

    form.resetForm();
  }
}
