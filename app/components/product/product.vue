<template>
	<div id='product'>
		<header-nav nav-style="black" v-bind:nav-cats="computedBread"></header-nav>
		<div class="product">
			<h1 class="product__title">{{productTitle}}</h1>
			<div class="product__image"><img v-bind:src='productMainImage'></div>
			<div class="product__section"
				v-bind:class="section.type === 'left'
					? {product__section_1: true}
					: {product__section_2: true}"
				v-for="section in productSections">

				<div class="product__section_left" v-if="section.type === 'left'">
					<div class="product__inner-image" v-on:click="showFullImage($event, section.image1)"><img v-bind:src='section.image1'></div>
					<div class="product__text-block">
						<h2 class="product__text-heading">{{section.title}}</h2>
						<p class="product__text-p" v-html="breakify(section.description)"></p>
					</div>
				</div>
				<div class="product__section_right" v-if="section.type === 'left'">
					<div class="product__inner-image" v-on:click="showFullImage($event, section.image2)"><img v-bind:src='section.image2'></div>
				</div>

				<div class="product__section_left" v-if="section.type === 'right'">
					<div class="product__inner-image" v-on:click="showFullImage($event, section.image1)"><img v-bind:src='section.image1'></div>
				</div>
				<div class="product__section_right" v-if="section.type === 'right'">
					<div class="product__inner-image" v-on:click="showFullImage($event, section.image2)"><img v-bind:src='section.image2'></div>
					<div class="product__text-block">
						<h2 class="product__text-heading">{{section.title}}</h2>
						<p class="product__text-p" v-html="breakify(section.description)"></p>
					</div>
				</div>
			</div>
			<div class="product__price" v-if="productPrice || productPriceText">
				<price :price="productPrice"
					:text="productPriceText"
					:itemData="itemData"
					v-on:removeFromWishlist="removeFromWishlist()"
					v-on:removeFromCart="removeFromCart()"
					v-on:add="checkIfInLs()"></price>
			</div>
			<div class="product__section product__section_form"
				:style="{'background-image': `url(${productSecondImage})`}">
				<form-component :confirm="true" :type="'product'"></form-component>
			</div>
		</div>
		<image-modal v-bind:image-data='imageController'></image-modal>
	</div>
</template>

<script>
import './product.sass';
import table from '../index/table.png';
import isMobile from '../utils/mobile-detect';

import Nav from '../nav/nav.vue';
import Form from '../form/form.vue';
import ImageModal from '../image-modal/image-modal.vue';
import PhoneForm from '../phone-form/phone-form.vue';
import PhoneFooter from '../phone-footer/phone-footer.vue';
import Price from './price/price.vue';

import db from '../database-controller/database-controller.js';

export default {
	firebase () {
		if (!this.itemId) {
			return;
		}

		return {
			productRaw: db.ref('products')
				.orderByChild('id')
				.equalTo(this.itemId),
			subCat: db.ref('subCat')
		};
	},
	data () {
		return {
			isMobile: isMobile(),
			table: table,
			recentImage: null,
			loading: true,
			itemId: this.$route.params.item,
			inWishlist: false,
			inCart: false,
			imageController: {
				active: false,
				src: null,
				offsetData: null
			}
		}
	},
	mounted: function () {
		if (!this.itemId) {
			return;
		}

		db.ref('products')
			.once('value', snapshot => {
				this.loading = false;
		});

		this.checkIfInLs();
	},
	methods: {
		showFullImage (event, image) {
			const target = event.target;
			const targetOffsets = target.getBoundingClientRect();

			target.style.opacity = 0;

			this.imageController.offsetData = {
				top: targetOffsets.top,
				left: targetOffsets.left,
				width: targetOffsets.width
			};
			this.imageController.src = image;
			this.imageController.active = true;
			this.recentImage = target;
		},
		breakify (text) {
			return text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
		},
		checkIfInLs () {
			const wishlist = this.$ls.get('wishlist');
			const cart = this.$ls.get('cart');

			if (Array.isArray(wishlist)) {
				wishlist.forEach((item, index) => {
					if (item.id === this.itemId) {
						this.inWishlist = true;
						this.wishListIndex = index;
					}
				});
			} else {
				this.inWishlist = false;
				this.wishListIndex = null;
			}

			if (Array.isArray(cart)) {
				cart.forEach((item, index) => {
					if (item.id === this.itemId) {
						this.inCart = true;
						this.cartIndex = index;
					}
				});
			} else {
				this.inCart = false;
				this.cartIndex = null;
			}
		},

		removeFromWishlist () {
			const wishlistItems = this.$ls.get('wishlist');

			wishlistItems.splice(this.wishListIndex, 1);
			this.$ls.set('wishlist', this.wishlistItems);

			this.checkIfInLs();
		},

		removeFromCart () {
			const cartItems = this.$ls.get('cart');

			cartItems.splice(this.cartIndex, 1);
			this.$ls.set('cart', this.cartItems);

			this.checkIfInLs();
		}
	},
	computed: {
		product () {
			if (this.productRaw.length) {
				return this.productRaw[0];
			}

			return null;
		},
		productTitle () {
			return this.product ? this.product.title : null;
		},
		productMainImage () {
			return this.product ? this.product.mainImage : null;
		},
		productSecondImage () {
			return this.product ? this.product.secondImage : null;
		},
		productSections () {
			return this.product ? this.product.sections : null;
		},
		productPrice () {
			return this.product ? this.product.price : null;
		},
		productPriceText () {
			return this.product ? this.product.priceText : null;
		},
		itemData () {
			return {
				image: this.productMainImage,
				name: this.productTitle,
				price: this.productPrice,
				productId: this.productId,
				id: this.itemId,
				inWishlist: this.inWishlist,
				wishListIndex: this.wishlistItems,
				cartIndex: this.cartIndex,
				inCart: this.inCart,
				status: 'Available now'
			};
		},
		parentCat () {
			const cat = this.subCat.filter(cat => {
				return cat.id === this.product.cat;
			});

			return cat.length ? cat[0].parentCat : null;
		},
		computedBread () {
			if (this.parentCat) {
				return [this.parentCat, this.product.cat, this.itemId];
			}

			return null;
		},
		isClosed () {
			return !this.imageController.active;
		}
	},
	watch: {
		isClosed (closed) {
			if (closed) {
				this.recentImage.style.opacity = 1;
			}
		}
	},
	components: {
		'header-nav': Nav,
		'form-component': Form,
		'image-modal': ImageModal,
		'phone-form': PhoneForm,
		'phone-footer': PhoneFooter,
		'price': Price
	}
}
</script>
