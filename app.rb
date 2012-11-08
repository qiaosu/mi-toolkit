require 'rubygems'
require 'json'
require 'sinatra'
require "debugger"
require "zip/zip"
require "zip/zipfilesystem"

enable :sessions

set :protection, :except => [:remote_token, :frame_options]

require "./routes"
require "./helpers"