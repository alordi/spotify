<template>
  <div id="app">
    <div id="nav">
      <h2 id="title"> Austin's Spotify App </h2>
    </div>
    <router-view/>
  </div>
</template>
<style>

#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#title {
  color: black;
  font-weight: bold;
  font-style: italic
}

.dd {
  margin: 20px;
}

.active {
  color: #101820;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #101820;
}
</style>
