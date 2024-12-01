export const cn = (...args) => {
  const classNames = args.reduce((arr, item) => {
    if (typeof item === 'string') return [...arr, ...item.split(' ')] // Strings.
    if ({}.toString.call(item) !== '[object Object]') return arr // Ignore everything else but objects.

    return Object.keys(item).reduce(
      (arr2, key) => (item[key] ? [...arr2, key] : arr2),
      arr,
    )
  }, [])

  
  return [...new Set(classNames)].join(' ')
}

// http://bit.ly/2Xmuwqf - micro UUID!
export const uuid = a =>
  a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)

export const randomNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

//email varification doing
export const isEmail = email => {
  return [
    email.includes('@'), 
    email.trim().split('@')[0].length, 
    email.split('@').pop().includes('.'), 
    !email.trim().includes(' '),
    email.length > 5, // At least 6 chars long 
    email.trim().split('@').pop().split('.').pop().length > 1,
  ].every(Boolean)
}
