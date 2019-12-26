require "pifi/lib/utils"

module PiFi
  class Streams
    include Utils

    def initialize(path_pub, path_priv="")
      @path_pub = path_pub
      @path_priv = path_priv
      check_paths
    end

    def all
      @all ||= pub.merge(priv)
    end

    def pub
      @pub ||= file_to_hash(@path_pub)
    end

    private

    def priv
      @priv ||= @path_priv.empty? ? {} : file_to_hash(@path_priv)
    end

    def check_paths
      raise ArgumentError, "Streams file not found at '#{@path_pub}'" unless File.file?(@path_pub)
      if ! @path_priv.empty? && ! File.file?(@path_priv)
        warn "Private streams file not found at '#{@path_priv}'"
        @path_priv = ""
      end
    end
  end
end
