
# SessionBridge

为了可以在服务器端操作客户第三方网站账户，保存客户的 session 在服务器端，而不需要考虑验证码等等问题。

SessionBridge 可以在服务器端开一个 headless 浏览器再把浏览器的界面传输给客户端，然后在客户端登陆第三方网站，这样就可以获得用户的第三方 session，今后就可以通过 session快照 在服务器端操作用户的账号了
