<script>
  export let title = "";
  export let attachments = [];
  export let text;
  let hasAttachments = false;
  export let highlighted = false;
  let cardHeight;
  let card;
  export let hashtags = [];
  export let sticky = false;

  // $: if (cardHeight > 300) {
  //   console.log("cardheight:", cardHeight)
  //   card.style.gridRowStart = "span 2"
  // }
  $: hasAttachments = attachments && attachments.images && attachments.images.length > 0 ? true : false;

  console.log("Content:", text)
</script>

<style>
  .card {
    display: grid;
    width: auto;
    height: fit-content;
    border: none;
    border-radius: 4px;
    box-shadow: 0px 0px 12px #ccccccaa;
    background-color: white;
    overflow: hidden;
  }
  .image-grid-container {
    display: flex;
    position: relative;
    height: fit-content;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #ff748b;
    color: white;
    z-index: 0;
    overflow: hidden;
    font-size: small;
  }
  .image-grid {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    background-color: #222;
  }
  .image-grid img {
    max-width: 100%;
    height: 50%;
    max-height: 150px;
    object-fit: cover;
    object-position: center;
    flex: 1;
  }
  .image-grid div {
    display: flex;
    flex-direction: column;
  }
  .image-grid div:nth-child(1) {
    grid-column: 1/-1;
  }
  .content {
    padding: 2em;
    font-size: small;
    white-space: pre-wrap;
  }
  .hashtags-container {
    display: flex;
    flex-wrap: wrap;
    background-color: #ff748b;
  }
  .hashtag {
    margin: auto 0;
    z-index: 1;
    padding: .5em .5em .5em .5em;
    background-color: #ff748b;
    /* background-color: white; */
    /* color: #ff748b; */
    color: white;
    text-align: left;
    font-weight: 600;
    font-size: x-small;
    /* border-radius: 4px; */
  }
  .highlighted {
    background-color: #ff748b;
    color: white;
    grid-column: 1/-1;
  }
  .sticky {
    grid-column: 1;
    grid-row: 1;
  }
</style>

<div class={highlighted ? "card highlighted" : "card"} bind:clientHeight={cardHeight} bind:this={card}>
  <div class="image-grid-container">
    {#if hasAttachments}
      <div class="image-grid">
        {#each attachments.images as image}<div><img src={image.downloadURL} alt={image.name} /></div>{/each}
      </div>
    {/if}
  </div>
  <div class={highlighted ? "content highlighted" : "content"}>
    {text}
  </div>
  <div class="action-bar" />
  <div class="hashtags-container">
    {#each hashtags as hashtag}
      <h3 class="hashtag">#{hashtag}</h3>
    {/each}
  </div>
</div>
