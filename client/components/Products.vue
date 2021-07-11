<!-- Please remove this file from your project -->
<!-- Please remove this file from your project -->
<template>
  <div class="container">
    <!-- FILTER -->
    <div class="container_filter" id="container_filter">
      <div class="filter-top">
        <h2 class="filter-title">Filter</h2>
        <button class="btn btn--gray" type="submit" @click="showByFilter">
          Submit
        </button>
      </div>

      <div class="filter_category">
        <div class="input-group">
          <label class="label">Search</label>
          <input
            class="textbox w100"
            type="text"
            name="text"
            placeholder="Lenovo"
            v-model="productName"
            required
          />
        </div>
        <div class="input-group">
          <label class="label">Category</label>
          <div class="checkbox">
            <input
              class="checkbox_input"
              type="checkbox"
              id="SelectAllCategories"
              @click="selectAll"
              v-model="allCategorySelected"
            />
            <label class="checkbox_input" for="SelectAllCategories"
              >Select All</label
            >
          </div>
          <div
            class="checkbox"
            v-for="category in categories"
            :key="category.id"
          >
            <input
              class="checkbox_input"
              type="checkbox"
              :value="category.Name"
              :id="category.Name"
              v-model="checkedCategories"
              checked=""
            />
            <label class="checkbox_text" :for="category.Name">{{
              category.Name
            }}</label>
          </div>
        </div>
        <div class="input-group">
          <label class="label">Price Range</label>
          <div class="side2">
            <input
              class="textbox w40"
              type="number"
              placeholder="0"
              v-model="priceFrom"
            />
            <input
              class="textbox w40"
              type="number"
              placeholder="99999999"
              v-model="priceEnd"
            />
          </div>
        </div>
        <div class="input-group">
          <label class="label">Sorting</label>
          <div class="checkbox">
            <input type="radio" id="one" value="asc" v-model="orderBy" />
            <label for="one">Asc</label>
          </div>
          <div class="checkbox">
            <input type="radio" id="two" value="desc" v-model="orderBy" />
            <label for="two">Desc</label>
          </div>
        </div>
      </div>
    </div>
    <!-- PRODUCTS -->
    <div class="container_products">
      <div class="products">
        <div
          class="product"
          v-for="(product, idx) in products"
          :key="product.id"
        >
          <div class="wrap">
            <div class="product-wrap">
              <a href=""
                ><img class="product_img" :src="product.Image_URL"
              /></a>
            </div>
            <div class="loop-action">
              <a class="add-to-cart" @click="displayProductWindow(idx)">
                Show More Detail
              </a>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.Name }}</h3>
            <div class="price">&#8376; {{ product.Cost }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- END PRODUCTS/ -->
    <!-- WINDOW -->
    <div class="window" id="window">
      <div class="window_cart">
        <div class="cart_photo">
          <img :src="product.Image_URL" alt="cart_photo" />
        </div>
        <div class="cart_info">
          <div class="cart_info_top mgbtm-15px">
            <h2 class="cart_title">{{ product.Name }}</h2>
            <button
              class="cart_close btn btn--small btn--submit"
              @click="hideProductWindow"
            >
              X
            </button>
          </div>
          <div class="mgbtm-15px">
            <label class="label">Cost</label>
            <h4 class="cart_cost">&#8376; {{ product.Cost }}</h4>
          </div>
          <div class="mgbtm-15px">
            <label class="label">Description</label>
            <p class="cart_text">{{ getLoremIfIsNull(product.Description) }}</p>
          </div>
          <button class="btn btn--gray">Buy</button>
        </div>
      </div>
    </div>
    <!-- END WINDOW/ -->
  </div>
</template>

<script>
import gql from "graphql-tag";

const QueryGetAllProducts = gql`
  query {
    products {
      Name
      Description
      Cost
      Image_URL
      Categories {
        Name
      }
    }
  }
`;
const QueryGetAllCategories = gql`
  query {
    categories {
      Name
    }
  }
`;

export default {
  data() {
    return {
      // Initialize your apollo data
      products: [],
      allCategorySelected: false,
      product: {
        Name: "Title",
        Cost: 0,
        Description: "Description",
        Image_URL: "",
      },
      categories: [],
      checkedCategories: [],
      orderBy: "",
      productName: "",
      priceFrom: 0,
      priceEnd: 9999999999,
    };
  },
  mounted() {},
  methods: {
    showByFilter: async function () {
      // console.log(this.checkedCategories.join('","'));
      let sortBy = this.orderBy != "" ? `orderBy: ${this.orderBy}, ` : "";
      let filter = this.getProductFilter();

      let queryGetProductsByFilter = gql`
        query {
          products(${filter} ${sortBy} CategoryName: {in: ["${this.checkedCategories.join(
        '","'
      )}"]}) {
            Name
            Description
            Cost
            Image_URL
            Categories {
              Name
            }
          }
        }
      `;
      const res = await this.$apollo
        .query({
          query: queryGetProductsByFilter,
          variables: {},
        })
        .then((queryRes) => {
          // Result
          console.log("Data: ", queryRes);
          this.products = queryRes.data.products; //Set Result
        });
    },
    getProductFilter: function () {
      let productName = `Name: "${this.productName}"`;
      let costDiaposone = `Cost:{gte: ${this.priceFrom} lte: ${this.priceEnd}}`;
      if (this.priceFrom == 0 && this.priceFrom == 0) {
        costDiaposone = "";
      }
      return `filter: {${productName} ${costDiaposone}}`;
    },
    displayProductWindow: function (index) {
      document.body.style.overflow = "hidden";
      document.getElementById("window").style.display = "block";
      document.getElementById("window").style.top = `${window.scrollY}px`;

      this.product = this.products[index];
      console.log(this.product);
    },
    hideProductWindow: function () {
      document.body.style.overflow = "";
      document.getElementById("window").style.display = "none";
    },
    getLoremIfIsNull: function (string) {
      if (string == "-" || string == " " || string == "") {
        return "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.";
      }
      return string;
    },
    selectAll: function () {
      this.checkedCategories = [];
      if (!this.allCategorySelected) {
        for (let i = 0; i < this.categories.length; i++) {
          this.checkedCategories.push(this.categories[i].Name);
        }
      }
    },
  },
  apollo: {
    products: {
      query: QueryGetAllProducts,
    },
    categories: {
      query: QueryGetAllCategories,
    },
  },
};
</script>

<style scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.mgbtm-15px {
  margin-bottom: 15px;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px 0;
}
/* FILTER MENU */
.container_filter {
  width: 25%;
  min-width: 250px;
  margin-right: 15px;
}

.filter-top {
  background: #fff;

  padding: 15px 25px;
  margin-bottom: 20px;

  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-title {
  color: #525252;
  font-weight: 500;
}

.filter_category {
  background: #fff;

  padding: 15px 25px;
  margin-bottom: 20px;

  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
}

.input-group {
  margin-bottom: 22px;
}

.label {
  color: #555;
  text-transform: capitalize;
  display: block;
  margin-bottom: 5px;
}

.textbox {
  line-height: 40px;
  background: #fafafa;
  -webkit-box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  -moz-box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  padding: 0 20px;
  color: #666;
  -webkit-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  transition: all 0.4s ease;
  -moz-appearance: textfield;
}
.textbox::-webkit-outer-spin-button,
.textbox::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.textbox::-webkit-input-placeholder {
  color: #666;
}
.textbox:-moz-placeholder {
  color: #666;
  opacity: 1;
}
.textbox::-moz-placeholder {
  color: #666;
  opacity: 1;
}
.textbox:-ms-input-placeholder {
  color: #666;
}
.textbox:-ms-input-placeholder {
  color: #666;
}

.checkbox {
  width: 100%;
}

/* PRODUCTS */
.container_products {
  width: 75%;
  margin-left: 15px;
  right: 0;
}
.products {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: -10px;
}

.product {
  width: 280px;
  margin: 0 auto 20px auto;
  background: white;
  padding: 20px;
  border: 1px solid #f1e7e8;
  border-radius: 10px;
}

.wrap {
  position: relative;
}
.product-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;

  width: 240px;
  height: 240px;
}
.product-wrap:after {
  content: "";
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 0;
  transform: scale(0.3);
  transition: 0.3s ease-in-out;
  border-radius: 10px;
}
.product:hover .product-wrap:after {
  opacity: 1;
  transform: scale(1);
}
.product-wrap a {
  display: block;
  text-decoration: none;
}
.product-wrap img {
  display: block;
  height: auto;
  width: auto;
  max-width: 220px;
  max-height: 220px;
}
.loop-action {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: 0.3s ease-in-out;
}
.product:hover .loop-action {
  opacity: 1;
}
.loop-action a {
  text-decoration: none;
  display: block;
  border: 1px solid white;
  border-radius: 5px;
  white-space: nowrap;
  text-transform: uppercase;
  padding: 0.5em 1em;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  position: relative;
  overflow: hidden;
  text-align: center;
  color: white;
  min-width: 160px;
  margin: 5px auto;
  transition: 0.3s ease-in-out;
  cursor: pointer;
}

.loop-action a:after {
  content: "";
  position: absolute;
  left: -220%;
  top: -500%;
  width: 140%;
  height: 1000%;
  transform: rotate(45deg);
  background: white;
  z-index: -1;
  transition: 0.3s ease-in-out;
}
.loop-action a:hover {
  color: black;
}
.loop-action a:hover:after {
  left: 0%;
}
.product-info {
  padding-top: 15px;
}
.product-title {
  font-weight: normal;
  color: #162546;
  font-size: 18px;
}
.price {
  color: #292929;
  font-style: italic;
  font-weight: bold;
}

/* Window */
.window {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}

.window_cart {
  width: 75%;
  background: #fff;

  padding: 25px;
  margin: 10px auto;

  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;

  display: flex;
  flex-direction: row;
}

.cart_photo {
  width: 30%;
  /* background: rgba(0, 0, 0, 0.2); */
  margin-right: 12.5px;
}

.cart_photo img {
  width: 100%;
}

.cart_info {
  width: 70%;
  /* background: rgba(0, 0, 0, 0.1); */
  margin-left: 12.5px;
}

.cart_info_top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/* BUTTONS */

.btn {
  display: inline-block;
  line-height: 40px;
  padding: 0 40px;
  -webkit-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  transition: all 0.4s ease;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  color: #fff;

  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.btn--small {
  line-height: 30px;
  padding: 0 15px;
}

.btn--gray {
  background: #525252;
}
.btn--gray:hover {
  background: #292929;
}
.btn--submit {
  background: #c5245a;
}
.btn--submit:hover {
  background: #961c45;
}
</style>