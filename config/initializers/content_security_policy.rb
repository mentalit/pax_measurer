# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.config.content_security_policy do |policy|
  policy.default_src :self, :https
  policy.connect_src :self, :https, "capacitor://localhost", "http://localhost"
  policy.img_src     :self, :https, :data, "capacitor://localhost"
  policy.script_src  :self, :https, :unsafe_inline, :unsafe_eval
  policy.style_src   :self, :https, :unsafe_inline
  policy.frame_src   :self, :https
end
