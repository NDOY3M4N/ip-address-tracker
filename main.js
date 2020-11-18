// Get the HTML elements
const myForm = document.querySelector('form')
const myIpAddr = document.querySelector('.ip-addr h2')
const myLocation = document.querySelector('.location h2')
const myTimezone = document.querySelector('.timezone h2')
const myIsp = document.querySelector('.isp h2')

// Map creation
const myMap = L.map('myMap', {
  zoomControl: false,
})

const mapDisplay = (lat, lng) => {
  const myIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [40, 50],
    iconAnchor: [20, 25],
  })

  myMap.setView([lat, lng], 16)
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap)

  L.marker([lat, lng], { icon: myIcon }).addTo(myMap)
}

// Get the info the page needs
const getData = (inputValue = '', searchType = 'IP') => {
  const url =
    searchType === 'IP'
      ? `https://geo.ipify.org/api/v1?apiKey=at_e8YFs79ARdh1PfVH4s5rf6bJf99VW&ipAddress=${inputValue}`
      : `https://geo.ipify.org/api/v1?apiKey=at_e8YFs79ARdh1PfVH4s5rf6bJf99VW&domain=${inputValue}`

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      myIpAddr.innerText = data.ip
      myLocation.innerText = `${data.location.region}, ${data.location.city}`
      myTimezone.innerText = `UTC ${data.location.timezone}`
      myIsp.innerText = data.isp
      mapDisplay(data.location.lat, data.location.lng)
    })
    .catch((error) => {
      myIpAddr.innerText = '__'
      myLocation.innerText = '__'
      myTimezone.innerText = '__'
      myIsp.innerText = '__'

      const myInput = myForm.searchInput
      myInput.classList.add('error')

      setTimeout(() => myInput.classList.remove('error'), 3000)
    })
}

// Search for any IP addresses or domains and see the key information and location
// The regex for a valid IP address is inspired by this post
// https://www.regular-expressions.info/numericranges.html

const regexIp = /^\b([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b(\.\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b){3}$/
const regexDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

myForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const myInput = myForm.searchInput

  if (myInput.value.match(regexIp)) {
    getData(myInput.value)
  }

  if (myInput.value.match(regexDomain)) {
    getData(myInput.value, (searchType = 'DOMAIN'))
  }

  if (!myInput.value.match(regexDomain) && !myInput.value.match(regexIp)) {
    myInput.classList.add('error')

    setTimeout(() => myInput.classList.remove('error'), 3000)
  }
})

// Load IP Address on the map on the initial page load
getData()
