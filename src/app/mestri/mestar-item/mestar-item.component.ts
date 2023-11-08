import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/chat/chat.service';
import { Mestar } from 'src/app/shared/models/mestar';


@Component({
  selector: 'app-mestar-item',
  templateUrl: './mestar-item.component.html',
  styleUrls: ['./mestar-item.component.scss']
})
export class MestarItemComponent {


  fullStars = 0;
  halfStars = 0;
  emptyStars = 0;

  @Input() mestar!: Mestar;
  categories: string[] = [];

  constructor(private chatService: ChatService,
    private router: Router){}
  
  ngOnInit(): void {
    if(this.mestar){
      this.categories  = this.mestar.categories.map(c => c.name);
      this.calculateStars(this.mestar.rating);
    }
  }

  calculateStars(rating: number) {
    this.fullStars = Math.floor(rating);
    this.halfStars = Math.round(rating - this.fullStars) ? 1 : 0;
    this.emptyStars = 5 - this.fullStars - this.halfStars;
  }

}
