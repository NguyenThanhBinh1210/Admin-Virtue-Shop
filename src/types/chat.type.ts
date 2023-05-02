export type ChatType = {
  includes: string[]
  result?: string
  _id?: string
  createdAt?: string
  updatedAt?: string
}

export type ChatTypeList = {
  message?: string
  data?: ChatType
}
