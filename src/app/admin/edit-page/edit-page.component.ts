import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostsService} from "../../shared/posts.service";
import {Subscription, switchMap} from "rxjs";
import {Post} from "../../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  form!: FormGroup
  post!: Post
  submitted = false
  uSub!: Subscription

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postsService.getById(params['id'])
        })
      ).subscribe((post: Post) => {
        this.post = post
          this.form = new FormGroup({
            title: new FormControl(post.title, [
              Validators.required,
              Validators.minLength(3)
            ]),
            text: new FormControl(post.text, Validators.required),
            author: new FormControl(post.author, Validators.required)
          })
    })
  }

  ngOnDestroy(): void {
    if(this.uSub){
      this.uSub.unsubscribe()
    }
  }

  submit() {
    if(this.form.invalid){
      return
    }

    this.submitted = true

    this.uSub = this.postsService.update({
      id: this.post.id,
      text: this.form.value.text,
      title: this.form.value.title,
      author: this.form.value.author,
      date: this.post.date
    }).subscribe(() => {
      this.submitted = false
      this.alert.success('Пост отредактирован!')
    })
  }
}
