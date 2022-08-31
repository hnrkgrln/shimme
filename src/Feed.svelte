<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import Shimmecard from "./Shimmecard.svelte";
  import { feed, hashtags } from "./stores/feed.js";

  const bgCard = "graphics/generic-card-crowd.jpg";
  const bgCard2 = "graphics/generic-card-politics.jpg";

  onMount(() => {
    getShimmeFeed();
  });

  function getShimmeFeed() {
    const db = firebase.firestore();
    db.collection("shimmes")
      // .where("hashtags", "array-contains", "shimme")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          feed.set([...$feed, doc.data()]);
        });
        console.log($feed);
      });
  }
</script>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    /* grid-auto-flow: row dense; */
    gap: 1.5em;
    padding: 2em;
    max-width: 720px;
    margin: 0 auto;
  }
</style>

<main>
  <!-- <Shimmecard title="#shimme #intro" highlighted={true}>Welcome to SHIMME! 

With SHIMME you can read and publish short messages. But: shimmes cannot be deleted or altered. This is possible thanks to IPFS, a file system for the distributed web.

Anyone can put anything on IPFS. Here, though, you read and publish shimmes. That's it.

So, is this a service we actually want?
  </Shimmecard> -->
  {#if $feed.length > 0}
    {#each $feed as shimme}
      <Shimmecard
        hashtags={shimme.hashtags}
        attachments={shimme.attachments}
        text={shimme.text}
        sticky={shimme.sticky} />
    {/each}
  {:else}
    <h2 style="text-align: center; color: #aaa;">Sorry, found no shimmes...{$hashtags.length > 0 ? $hashtags.map(ht => " #" + ht) : ""}. :-(</h2>
  {/if}
</main>
