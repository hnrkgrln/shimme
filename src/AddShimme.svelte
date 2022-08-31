<script>
  import firebase from "firebase/app";
  import "firebase/firestore";
  import PicUpload from "./PicUpload.svelte";
  import Spinner from "./ui/Spinner.svelte";
  import { loading } from "./stores/loading";

  let picPicker;
  let attachments = [];
  let uploadImages;

  let textArea;
  let textAreaValue = "";
  let textAreaValuePrev = "";
  $: {
    if (textAreaValue.length > 320) textAreaValue = textAreaValuePrev;
    else textAreaValuePrev = textAreaValue;
  }

  let prevScrollHeight = 0;
  function updateTextareaHeight() {
    textArea.style.height = "auto";
    if (textArea.scrollHeight !== prevScrollHeight) {
      textArea.style.height = textArea.scrollHeight + "px";
      prevScrollHeight = textArea.scrollHeight;
    }
  }
  let count = 0;
  $: count = textAreaValue.length;

  function makeShimme() {
    if (textAreaValue.length <= 0) return;

    loading.set(true);

    let hashtags = textAreaValue.match(/#[A-Za-z0-9]*/g) || [];
    hashtags = hashtags.map((ht) => {
      return ht.indexOf("#") === 0 ? ht.substring(1) : ht;

    });
    console.log(hashtags)

    const db = firebase.firestore();
    db.collection("shimmes")
      .add({
        text: textAreaValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        hashtags: hashtags.length > 0 ? hashtags : "shimme" //TODO: Should be set in backend
      })
      .then(async (doc) => {
        textAreaValue = "";
        loading.set(true);

        try {
          const uploads = await uploadImages(doc.id);

          if (uploads && uploads.length > 0) {
            var images = [];
            for (let snapshot of uploads) {
              images = [
                ...images,
                {
                  name: snapshot.metadata.name,
                  downloadURL: await snapshot.ref.getDownloadURL(),
                },
              ];
            }

            await doc.update({
              attachments: {
                images: [...images],
              },
            });
          }
        } finally {
          loading.set(false);
          attachments = [];
        }
      })
      .catch((err) => {
        console.log("Cannot save shimme.", err);
        loading.set(false);
      });
  }
</script>

<style>
  textarea {
    outline: none;
    border: none;
    resize: none;
    min-height: 2em;
    width: 100%;
    font-family: "IBM Plex Mono";
    font-weight: 500;
    font-size: smaller;
    letter-spacing: 0.1rem;
    overflow: hidden;
    margin-bottom: 1.5em;
  }
  ::placeholder {
    color: #aaa;
    font-style: italic;
  }

  #create-container {
    display: grid;
    position: relative;
    grid-template-columns: 1fr;
    height: fit-content;
    width: 100%;
    background-color: white;
    box-shadow: 0px 0px 12px #ccccccaa;
    border-radius: 4px;
  }
  #textarea-container {
    padding: 2.5em;
  }
  .action-pane {
    display: flex;
    width: 100%;
    grid-column: span -1;
    justify-content: space-between;
  }
  #create-container textarea {
    flex: 1;
  }
  #send-btn {
    width: fit-content;
    align-self: flex-end;
    justify-self: flex-end;
    background-color: #ff748b;
    color: white;
    border: none;
    padding: 0.6em 0.8em;
    margin: 0 0.8em 0.8em 0;
    font-family: "IBM Plex Mono";
    font-weight: 500;
    font-size: smaller;
    box-shadow: 0 0 5px #ff748bdd;
    border-radius: 4px;
  }

  i {
    color: #ff748b;
  }
  .action-btn {
    background-color: white;
    border: none;
  }
  #picture-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 1em;
    width: 80%;
    margin: 0 auto;
  }
  #picture-preview {
    position: relative;
    margin-bottom: 2em;
    box-shadow: 0px 0px 12px #cccccc;
  }
  #picture-preview img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  #picture-preview-close {
    background-color: white;
    border-radius: 50px;
    box-shadow: 2px 2px 5px #ccccccaa;
    position: absolute;
    top: -10px;
    right: -10px;
    cursor: pointer;
  }
</style>

<div id="create-container">
  <div id="textarea-container">
    <textarea
      id="t"
      placeholder="A #shimme may be forgotten, though never deleted or altered."
      on:input={updateTextareaHeight}
      bind:value={textAreaValue}
      bind:this={textArea} />
    <span style="color: #aaa; float: right; font-size: smaller;">{count}/320</span>
  </div>

  {#if attachments && attachments.length > 0}
    <div id="picture-preview-grid">
      {#each attachments as image}
        <div id="picture-preview">
          <img src={window.URL.createObjectURL(image)} alt="Preview" />
          <i
            id="picture-preview-close"
            class="material-icons"
            on:click={() => (attachments = null)}>cancel</i>
        </div>
      {/each}
    </div>
  {/if}

  {#if $loading}
    <Spinner />
  {/if}

  <div class="action-pane">
    <PicUpload
      bind:fileDialog={picPicker}
      bind:files={attachments}
      bind:upload={uploadImages} />
    <button class="action-btn" on:click={() => picPicker.click()}>
      <i class="material-icons" style="font-size: 3em;">image</i>
    </button>
    <button id="send-btn" on:click={makeShimme}>PUBLISH</button>
  </div>
</div>
