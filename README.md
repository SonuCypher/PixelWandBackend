
# PixelWand Backend Authentication

This project is a backend authentication task assigned by PixelWand


## API Reference

#### Register User

```http
  POST http://localhost:3000/api/users/signup
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your email |
| `name` | `string` | **Required**. Your name |
| `password` | `string` | **Required**. Your password |


#### Login User

```http
  POST http://localhost:3000/api/users/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

#### Protected Route 

```http
  GET http://localhost:3000/api/users/secret/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your token you get when you register or login |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Your id you get when you register or login |

#### Refresh Token Route 

```http
  POST http://localhost:3000/api/users/refreshtoken/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `refId` | `string` | **Required**. Your refresh token Id you get when you register or login |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Your id you get when you register or login |

#### Logout Route 

```http
  POST http://localhost:3000/api/users/logout/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `refId` | `string` | **Required**. Your refresh token Id you get when you register or login |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Your id you get when you register or login |





## Deployment

After installing the dependancies with npm -i , create an .env file with variables given below and start server.if haven't installed nodemon package install it using npm. 

#### add these environment variables

- JWTSECRET: your JWT secret
- MONGODB_CONNECTION:your mongodb connection link

```bash
  npm start
```
or
```bash
  nodemon index.js
```

