import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArtService } from 'src/app/services/art.service';
import { environment } from 'src/environments/environment';
import { Artwork, ArtworkStyle } from 'src/models';

@Component({
    selector: 'app-collection-single',
    templateUrl: './collection-single.component.html',
    styleUrls: ['./collection-single.component.css']
})

export class CollectionSingleComponent implements OnInit, OnDestroy {
    public routeSub !: Subscription;
    public art !: Array<Artwork>;
    public artstyle !: ArtworkStyle;
    public error !: Error;
    public environment = environment

    constructor( 
        private artService: ArtService,
        private activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        this.routeSub = this.activatedRoute.params.subscribe({
            next: (params: Params) => {
                this.artService
                .getArtworkStylesSingle(params['id'])
                .subscribe({
                    next: (itemList: ArtworkStyle) => {
                        this.artstyle = itemList;
                        this.art = itemList.artworks;
                        console.log(this.art)
                    },
                    error: e => this.error = e
                })
            },
            error: e => this.error = e
        });
    }

    productToCart(item: Artwork): void {
        let cart : any = localStorage.getItem('ESIA_Cart');

        if(cart == null){
            cart = [];
        } else{
            cart = JSON.parse(cart);
        }
        cart.push(item);
        console.log(cart)
        localStorage.setItem('ESIA_Cart', JSON.stringify(cart));
        this._snackBar.open(`Added ${item.title} to your cart`, 'X', {duration: 3000});
    }
  
    ngOnDestroy(): void {
        if (this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}