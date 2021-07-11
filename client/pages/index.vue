<template>
  <div class="main">
    <div class="header">
      <h2>Just Watch</h2>
      <p>{{ RandomText }}</p>
    </div>
    <Products />
  </div>
</template>

<script>
export default {};
</script>


<style>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

input {
  outline: none;
  margin: 0;
  border: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  /* font-size: 14px; */
  font-family: inherit;
}

button {
  outline: none;
  background: 0 0;
  border: none;
}

.main {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #000;
  max-width: 1280px;
  padding: 10px;
  min-width: 570px;
}

.header {
  width: 100%;
  background: #525252;
  color: #fff;
  padding: 25px;

  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* align-content: center; */
  align-items: center;
}
.w25 {
  width: 25%;
}
.w40 {
  width: 40%;
}
.w100 {
  width: 100%;
}
.side2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      RandomText: "Here Is Random Text",
    };
  },
  async mounted() {
    let res = await axios.get(
      "https://random-word-api.herokuapp.com/word?number=1"
    );
    this.RandomText = res.data[0];
  },
};
</script>

