<script>
  import firebase from "firebase/app";
  import "firebase/storage";
  export let files;
  export let fileDialog;

  export const upload = (id) => {
    if (files && files.length > 0) {
      console.log("files", files)
      return Promise.all(Array.from(files).map((file, i) => {

        //Max 4 files
        if (i >= 4)
          return true;
        
        return firebase
        .storage()
        .ref("shimme/" + id + "/" + file.name)
        .put(file)
      }))
    }
    return new Promise((resolve, reject) => resolve([]));
  };
</script>

<svelte:options accessors={true} />
<input
  type="file"
  hidden
  accept="image/*"
  multiple
  bind:files
  bind:this={fileDialog} />
