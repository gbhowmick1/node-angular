import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  isLoading:boolean = true ;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 7, 10];
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
      this.isLoading = false;
    });
  }
  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe( () => {
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.postsService.getPosts(pageData.pageSize,pageData.pageIndex+1);
  }
}


