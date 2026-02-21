import axios from 'axios'

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/notification`

export const getNotifications = async (id:any) => {
    return axios.get(`${base_url}/get/${id}`)
            .then(res => {
                return res.data})
            .catch(error => {throw error});
}

export const readNotifications = async (id:any) => {
    return axios.put(`${base_url}/read/${id}`)
            .then(res =>  res.data)
            .catch(error => {throw error});
}