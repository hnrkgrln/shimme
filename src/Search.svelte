<script>
  import { feed, hashtags } from "./stores/feed.js";
  import firebase from "firebase/app";
  import "firebase/firestore";

  let searchField = "";
  let hashtagsTmp = [];

  function search() {
    hashtagsTmp = searchField.split(" ")
      ? searchField.split(" ")
      : searchField.split();
    hashtagsTmp = hashtagsTmp.map((ht, i) => {
      if (i < 10) return ht;
    });

    if (searchField.length <= 0) {
      getShimmeFeed();
      return;
    }

    console.log(hashtagsTmp);

    hashtagsTmp = hashtagsTmp.map((ht) => {
      ht = ht.indexOf("#") === 0 ? ht.substring(1) : ht;
      ht = ht.toLocaleLowerCase();
      return ht;
    });

    hashtags.set(hashtagsTmp);
    const db = firebase.firestore();
    db.collection("shimmes")
      .where("hashtags", "array-contains-any", hashtagsTmp)
      // .orderBy("createdAt", "desc")
      .limit(30)
      .get()
      .then((snapshot) => {
        feed.set([]);
        snapshot.docs.forEach((doc) => {
          feed.set([...$feed, doc.data()]);
        });
      });
  }

  function getShimmeFeed() {
    const db = firebase.firestore();
    db.collection("shimmes")
      // .where("hashtagsTmp", "array-contains", "shimme")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          feed.set([...$feed, doc.data()]);
        });
        console.log(feed);
      });
  }
</script>

<style>
  #search-bar {
    display: inline-flex;
    align-content: center;
    justify-content: center;
    align-self: center;
    width: 100%;
    height: 2.5em;
    box-shadow: 0px 0px 12px #ccccccaa;
    border-radius: 4px;
    overflow: hidden;
  }
  #search-bar input {
    width: 100%;
    border: none;
    padding: 1em;
    font-size: small;
    letter-spacing: 0.2em;
  }
  #search-bar button {
    width: fit-content;
    height: 100%;
    align-self: flex-end;
    background-color: #ff748b;
    color: white;
    border: none;
    padding: 0.8em 1em;
    font-family: "IBM Plex Mono";
    font-weight: 500;
    font-size: small;
  }
</style>

<div id="search-bar">
  <input type="text" placeholder="Find shimmes" bind:value={searchField} />
  <button id="search-btn" on:click={search}>
    <i class="material-icons">search</i>
  </button>
</div>
