import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Listing } from 'src/app/shared/models/listing';
import { Offer } from 'src/app/shared/models/offer';
import { NatjecajService } from '../natjecaj.service';

@Component({
  selector: 'app-natjecaj',
  templateUrl: './natjecaj.component.html',
  styleUrls: ['./natjecaj.component.scss']
})
export class NatjecajComponent implements OnInit {

  listing: Listing = {} as Listing;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  modalRef?: BsModalRef;

  alreadyApplied?: boolean;

  listingForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
  });

  constructor(private title: Title,private modalService: BsModalService,private natjecajService: NatjecajService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router)
  {
      this.title.setTitle('Opis natječaja');
  }

    ngOnInit(){

    this.checkAccessMethod();

    this.galleryOptions = [
      {
        width: '50%',
        height: '500px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnails: false
      }];
      this.galleryImages = [
        {
          medium: '../../assets/register_image.png',
          big: '../../assets/register_image.png'
        },
        {
          medium: '../../assets/main-page-background.jpg',
          big: '../../assets/main-page-background.jpg'
        },
        {
          medium: '../../assets/main-page-background.jpg',
          big: '../../assets/main-page-background.jpg'
        }
      ];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSubmit(){
    if(this.listingForm.valid){

      const priceValue = this.listingForm.controls['price'].value;
      const price = typeof priceValue === 'number' ? priceValue : 0;

      const offer = {
        natjecajId: this.listing.id,
        description: this.listingForm.controls['description'].value,
        price: price
      } as Offer;

      this.natjecajService.createOffer(offer).subscribe({
        next: async () => {
          this.toastr.success('Prijava na natječaj uspješna!', '', {
            positionClass: 'toast-bottom-right',
          });
          await new Promise(f => setTimeout(f, 1000));
          location.reload();
        },
        error: () => {
          {
            this.listingForm.markAllAsTouched();
            this.toastr.error('Prijava na natječaj neuspješna!');
          }
        }
      });
    }
  }

  checkAccessMethod(){
    let listingId = '0';
    if (history.state.listing === undefined) {
      this.route.paramMap.subscribe(params => {
        listingId = params.get('id') ? params.get('id')! : '0';
        if (listingId !== null) {
          this.natjecajService.getListing(listingId).subscribe({
            next: (response) => {
              this.listing = response;
            },
            error: () => {
              console.log('error occurred while fetching listing');
            }
          });
        }
      });
    } else {
      this.listing = history.state.listing;
      listingId = this.listing.id;
    }
   this.checkIfAlreadyApplied(listingId);
  }


 checkIfAlreadyApplied(listingId: string){
    if (listingId !== null) {
      this.natjecajService.checkApplied(listingId).subscribe({
        next: (response) => {
          this.alreadyApplied = response;
        },
        error: (response) => {
          this.alreadyApplied = false;
          console.log('error occurred while checking if user already applied');
        }
      });
    }
  }
}
