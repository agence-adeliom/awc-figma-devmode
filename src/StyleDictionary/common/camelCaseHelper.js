export default (name) => String(name)
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/[^A-Za-z0-9]+/g, '$')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}$${b}`)
      .toLowerCase()
      .replace(/(\$)(\w)/g, (m, a, b) => b.toUpperCase());