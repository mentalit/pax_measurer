Rails.application.config.session_store :cookie_store,
  key: '_pax_measurer_session',
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true