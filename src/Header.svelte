<script>
  const logo = "./graphics/logo2.svg";
  import SearchBar from './Search.svelte'
</script>

<style>
  header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    max-width: 992px;
    align-items: flex;
    justify-content: flex-start;
    margin: 0 auto;
  }
  #logo {
    justify-content: flex-start;
    width: 100%;
    border-radius: 4px;
  }
  #logo img {
    height: 110px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
</style>

<header>
  <div id="logo"><img src={logo} alt="shimme-logo" /></div>
  <div />
  <SearchBar />
</header>
