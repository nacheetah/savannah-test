import axios from 'axios'

export const getUser = async (param: string, page = 1) => {
  try {
    const res = await axios.get(
      `https://api.github.com/search/users?q=${param} in:login&per_page=9&page=${page}`
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getPublicRepos = async (url: string) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getCommitHistories = async (url: string) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
