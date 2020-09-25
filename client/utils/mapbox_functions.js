export function handleClickGeorge () {
        console.log('clicking! george')

  }

  export function setNameModule () {
      if (dataStructureType1.name != undefined) {
            return dataStructureType1.name
          } else if (dataStructureType2.name != undefined) {
            return dataStructureType2.name
          } else {
            return "Toilets :)"
  }}


  export function capitalize(sentence) {
      let arrayOfStrings = sentence.split(" ")
      if (arrayOfStrings.indexOf("") != -1) { // in case there's only one word (Longburn was being deleted >:c ) .length might've been useful)
        arrayOfStrings.splice(arrayOfStrings.indexOf(""), 1) // in case there's an extra space in a sentance ie "yo  dog."
      }
      let capitalizedArray = arrayOfStrings.map(string => {
        const wordBody = string.substr(1)
        return (string[0].toUpperCase() + wordBody.toLowerCase())
      })
      let capitalizedStr = capitalizedArray.join(' ')
      return (capitalizedStr)
    }
    popup[0] = {
      coordinates: coordinates,
      description: description,
      map: map
    }
    return (
      popup[0]
    )
  }