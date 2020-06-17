function main() {
  try {
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
    doSomethingWithDb()
  } catch(err) {
    switch(err.name) {
      case 'CONNEXION_ERROR':
        retryConnect()
        break
      case 'INVALID_RECORD':
        console.error("Vous n'avez pas insérer la bonne donnée")
        break
      case 'HTTP_ERROR':
        resendQuery()
        break
      default:
        console.error(err)
    }
  }
}

function doSomethingWithDb() {
  const e = new Error(`Nous n'avons pas pu nous connecter avec la base de données.`)
  e.name = 'CONNEXION_ERROR'
  throw e
}

main()