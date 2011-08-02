require 'rubygems'
require 'sinatra'
require 'heroku'
require 'open-uri'
require 'nokogiri'
require 'haml'
require 'sass'

get '/credits' do
  haml(:credits, {:layout => :'layouts/default'})
end
get '/' do
  redirect "/presentation/1"
end
get '/presentation/:slide' do |slidenum|
  puts "slide number is #{slidenum}"
  slide = "slides/#{slidenum}"
  puts "slide is #{slide}"
  haml( :"#{slide}", {:layout => :'layouts/default'})
end

get '/render_slide/:slide' do |slidenum|
  slide = "slides/#{slidenum}"
  haml(:"#{slide}")
end


get '/stylesheets/presentation.css' do
  sass :'stylesheets/presentation'
end
