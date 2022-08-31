<script>
	import firebase from "firebase/app";
	import Header from "./Header.svelte";
	import AddShimme from "./AddShimme.svelte";
	import Feed from "./Feed.svelte";

	const firebaseConfig = {
		apiKey: "AIzaSyCpLWQPll4QCZnr9oPS1QFOigtzuJKHQU4",
		authDomain: "shimme-b7ba5.firebaseapp.com",
		projectId: "shimme-b7ba5",
		storageBucket: "shimme-b7ba5.appspot.com",
		messagingSenderId: "296365163669",
		appId: "1:296365163669:web:eb16e34c1f5b536f29879c",
		measurementId: "G-VL30711M3J",
	};

	firebase.initializeApp(firebaseConfig);
</script>

<style>
	#container {
		display: flex;
		flex: 1;
		justify-content: center;
		justify-self: center;
		height: auto;
		padding: 4em 3em 3em 3em;
		max-width: 500px;
		margin: 0 auto;
	}
</style>

<Header />
<div id="container">
	<AddShimme />
</div>
<Feed />
