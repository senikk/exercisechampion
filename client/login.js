Template.login.events({
	"submit form": function (event) {
		event.preventDefault();
        var email = event.target.loginEmail.value;
        var pwd = event.target.loginPassword.value;

        Meteor.loginWithPassword(email, pwd, function (error) {
    		if(error) {
				if(error.reason == "User not found") {
					Accounts.createUser({email: email, password: pwd}, function(error) {
						if (error) setAlertInfo("Failed creating user");
					});
				} else setAlertInfo("Login failed"); 
			}
        });
	}
});

Template.forgotPassword.events({
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault();

    var forgotPasswordForm = $(e.currentTarget),
        email = forgotPasswordForm.find('#forgotPasswordEmail').val();

    if (email.length > 0) {

      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            setAlertInfo("This email does not exists");
          } else {
            setAlertInfo("We are sorry but something went wrong.");
          }
        } else {
        	setAlertOk("Email Sent. Check your mailbox");
        }
      });

    }
    return false;
  },
});

if (Accounts._resetPasswordToken) {
  Session.set('resetPassword', Accounts._resetPasswordToken);
}

Template.resetPassword.helpers({
 resetPassword: function(){
  return Session.get('resetPassword');
 }
});

Template.resetPassword.events({
  'submit #resetPasswordForm': function(e, t) {
    e.preventDefault();

    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();

    if (!!password && !!passwordConfirm && password.length > 0 && (password == passwordConfirm)) {
      Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
      	if (err) {
        	setAlertInfo("We are sorry but something went wrong.");
        } else {
          	setAlertOk("Your password has been changed. Welcome back!");
          	Session.set("resetPassword", null);
        }
      });
    }
    return false;
  }
});