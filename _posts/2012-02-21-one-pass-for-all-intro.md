---
layout: post
category: project
tags:
    - project
    - bookmarklet
    - password
    - security
title: One Pass For All - An introduction to 1pass4all
---

One Pass For All
----------------

As an internet user, you probably have a bunch of web accounts.
With few exceptions, all of them are password-protected. 
To keep these accounts as safe as possible, you have to figure out
a set of strong yet easy-to-remember and hard-to-guess passwords. Moreover,
these passwords shouldn't be the same as or similar to each other, or
more strictly, the relationship among these passwords should be hard to detect.
Otherwise, if one of them is compromised, so are the others. With the 
number of accounts growing, password maintenance tends to be a thorny issue.
That's where the password management tools come in. The key idea of most of
them is pretty straightforward: they securely keep track of all account
passwords for a user so that he only need remember **one** single
super-password(called *master password*), by which he can access the encrypted
password database whenever in need.

Having used password management tools(e.g. [KeePass](http://keepass.info/), 
[1Password](https://agilebits.com/onepassword), [LastPass](https://lastpass.com/))
for a fairly long time, I still feel they are not perfectly desirable.
Although all of them can generate random passwords, they are inherently
unfriendly to my memory. Surely, I don't have to remember them, and that is
exactly the whole point of these managers, isn't it? But it's kind of a pain
to launch an additional application each time to log in an account.
Having them or browsers autofill passwords is possible, but less secure.
My personal solution used to be applying some rules or functions to some
predefined private variables to produce passwords.
Being a programmer, I've even written some scripts to help reproduce them.
The catch of this approach is I'll be out of luck when away from my own
computer. Finally, it occurs to me that JavaScript is a better choice than
shell scripts in such situation, for the former is more related to browsers
and its runtime environment is more available. Therefore, I begin to
focus on [bookmarklet] [bookmarklet] way.
Technically, a bookmarklet is a piece of JavaScript saved as the URL of a 
bookmark in a browser or as a hyperlink on a web page. Unlike a normal
bookmark, once clicked a bookmarklet won't take you to another web page.
Instead, the stored JavaScript code will be executed in the current web page.
It's unobtrusive, cross-browser, handy, and easy-to-install.

To avoid reinventing the wheel, I look up the web to see if anyone else has
the same idea. It turns out [SuperGenPass] [sgp]
meets my requirement quite well. Basically, SuperGenPass is able to transform a
master password into strong and different passwords for the different web sites.
Not surprisingly, it uses [MD5] [MD5] algorithm to achieve the goal. As a one-way
[cryptographic hash function] [hash_function], MD5 can quickly convert the
combination of a master password and an internet domain
to an input-sensitive, pseudo-random string, which implies that even if the
password for some specific website is compromised, it is infeasible to reversely
compute the original master password or passwords for other websites.
Great as the idea is, it's not new to me. The actual sweet spot to me is that it 
populates the password just in-place; namely, after a user fills out a master
password in a password field and clicks the SuperGenPass bookmarklet,
the hashed password will directly replace the master password.
By contrast, running a script under a shell and copying or retyping the output
into password field is somewhat unsafe and cumbersome.

Life becomes easier now. With the aid of a password bookmarklet, I only have to
keep one secret key in mind, yet confidently sign on various websites with
unique and strong passwords, without even knowing what they actually look like.
That said, traditional password managers still have their places, they may
save the hints of some(one or very few) master passwords just in case,
or autofill login form for non-crucial accounts on trusted machines,
or record some other sensitive information.

Before adopting SuperGenPass, I take a closer look at its features and source
code. In my opinion, there are some defects that cannot be ignored.
For one thing, MD5 is
[considered cryptographically broken](http://www.kb.cert.org/vuls/id/836068).
It's OK to serve as file integrity checker, but not that competent as a password
generator. What is worse, SuperGenPass's default 
[salt] [salt] is empty and cannot
be customized unless you modify the source code. This makes it more vulnerable
to [dictionary attack](http://en.wikipedia.org/wiki/Dictionary_attack).
Another problem is SuperGenPass is solely based on
[Base64](http://en.wikipedia.org/wiki/Base64), which means the generated
password are mainly composed of letters and digits, excluding many special
characters like `?`, `!`, `$`, etc. This may dilute the strength of the 
passwords, especially considering the default password length is only 10.
One more thing that concerns me is it totally neglects the login name(username).
I have multiple accounts on the same websites(e.g. gmail, dropbox), and
definitely don't wish all of them share passwords. Appending or prepending
a master password with a username may be barely enough, but nominally 
this make ONE master password not really true, and theoretically,
simple concatenation of a key and data is less appropriate than
[HMAC] [HMAC] algorithm. In addition, it seems that SuperGenPass doesn't work
well on password-change page(let me know if I am wrong here). I have no clue
why sometimes it autofills all passwords including old password, new password
and confirmed new password, sometimes it only fill just one or two of them.
Eventually, I decide to develop one by myself from scratch. As a result, a
gadget named [1pass4all]({{site.url}}/1pass4all/) (i.e. one pass for all)
comes out.

Hopefully, 1pass4all provides some improvements over SuperGenPass as follows:

* security:

  1pass4all is based on algorithm HMAC-SHA224, seeing that [SHA-2] [SHA-2] is
  more secure than MD5, and HMAC is more suitable than plain concatenation. 
  By default, the generated password may contain any printable characters(Base94)
  instead of Base64 characters, and password's maximal length extends from 24
  to 26. Besides, it supports customizable salt and hash iteration(for
  [key stretching](https://secure.wikimedia.org/wikipedia/en/wiki/Key_stretching)).
  Furthermore, 1pass4all can take username into account, which means the same
  master password on the same website will result in different passwords
  as long as logins differ.

* usability:
 
  When possible, 1pass4all will auto-login after populating password
  without popping up a confirmation form. If everything goes smoothly,
  the bookmarklet just acts as a login button.
  Normally, clicking the bookmarklet will only change the value of the focused
  password field(or the first one if none is focused). This is less confusing, 
  and can avoid unwanted password transformation(e.g. those manually typed
  old-password).

* functionality:

  Aiming at advanced users, 1pass4all supports a specialized password syntax,
  so that they can specify username auto-detection, password-length, salt,
  hash iteration, password character set etc. in the password field(instead of
  a pop-up form) on-the-fly.

Like SuperGenPass, 1pass4all also has mobile version in case you cannot 
or don't want to install bookmarklet for some reason. For example, when you are
on a mobile or on other's computer, or you are visiting an untrusted website
that may steal your master password, or you are logging on a non-browser
application.

I will be gratified if your interest has been aroused so far. Please don't
hesitate to [give it a try]({{site.url}}/1pass4all/archive/install.html) now.
For further instructions, you may read
[README file]({{site.github_home}}/1pass4all/blob/master/README.rst).
Any problems and suggestions are welcome in the comments below.

Lastly,  I'd like to acknowledge SuperGenPass for inspiring me to develop
this project.

Reference
---------

[1] [SuperGenPass] [sgp]

[2] [Wikipedia: bookmarklet] [bookmarklet]

[3] [Wikipedia: MD5] [MD5]

[4] [Wikipedia: Cryptographic_hash_function] [hash_function]

[5] [Wikipedia: Salt_(cryptography)] [salt]

[6] [Wikipedia: SHA-2] [SHA-2]

[7] [Wikipedia: HMAC] [HMAC]

[bookmarklet]: http://en.wikipedia.org/wiki/Bookmarklet
[sgp]: http://supergenpass.com
[MD5]: http://en.wikipedia.org/wiki/MD5
[hash_function]: http://en.wikipedia.org/wiki/Cryptographic_hash_function
[salt]: http://en.wikipedia.org/wiki/Salt_(cryptography)
[SHA-2]: http://en.wikipedia.org/wiki/SHA-2
[HMAC]: http://en.wikipedia.org/wiki/HMAC
