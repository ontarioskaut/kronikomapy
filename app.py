#!/usr/bin/python3
from bottle import route, run ,redirect,request,default_app, static_file, template, response
from beaker.middleware import SessionMiddleware
import os, json
from datetime import datetime

root = "/"
users = []

#Set session parameters
session_opts = {
    'session.type':'file', # save the session as a file
    'session.cookei_expires':3600, # The session expiration time is 3600 seconds
    'session.data_dir':'/tmp/sessions', # session storage path
    'sessioni.auto':True
}

def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        # set CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

        if request.method != 'OPTIONS':
            # actual request; reply with the actual response
            return fn(*args, **kwargs)

    return _enable_cors
    
def reloadusers():
    try:
        with open('users.json') as f:
            global users
            users = json.load(f)
    except Exception as e:
        print("Can't open file with users: " + str(e))
        
def authorized():
    s = request.environ.get('beaker.session')
    return s.get('user',None)
    
@route('/login')
def login(chyba=0):
    if(request.environ.get('beaker.session').get('user',None)):
        return redirect("/admin")
    return template('templates/login.html', err=chyba)
 
@route('/login', method='POST')
def do_login():
        if(request.environ.get('beaker.session').get('user',None)):
            return redirect(root)
        username = request.forms.get('user')
        password = request.forms.get('password')
        reloadusers();
        for u in users:
            if username == u["name"] and password == u["password"]:
                s = request.environ.get('beaker.session')  
                s['user'] = username
                s.save()
                return redirect("/admin")
        return login(1)

@route('/logout')
def logout():
    request.environ.get('beaker.session').delete()
    return redirect(root)
        
@route('/admin')
def admin():
    username = authorized();
    if not username:
        return redirect("/login")
    else:
        return template('templates/admin.html')
        
@route('/username') #check username
def username():
    username = authorized();
    if not username:
        return "unauthorized"
    else:
        s = request.environ.get('beaker.session')  
        return "auth ok - " + s['user']
        
@route('/')
def mainpage():
    return template('templates/index.html')

@route('/mapfeatures.json')
@enable_cors
def features():
    return static_file("features.json", root="static");

@route('/static/<something>')
@enable_cors
def staticfile(something):
    return static_file(something, root="static");
    
@route('/save', method='POST')
def save():
    username = authorized();
    if not username:
        return "unauthorized"
    else:
        s = request.environ.get('beaker.session')
        data = request.forms.get('data')
        if len(data)>20:
            os.system("cp static/features.json static/oldfeatures/fatures-" + datetime.now().strftime("%d_%m_%Y-%H_%M_%S") + ".json")
            with open('static/features.json', 'w') as f:
                f.write(data)
                return "ok"
        else:
            return "too short"
app = default_app()
app = SessionMiddleware(app, session_opts)
run(app=app,host='localhost', port=6969, debug=True, server='paste') 
#paste server supports multithreading (default doesn't)
#to use your domain while running nginx, you must set reverse proxy