const _ = require('lodash');
const { stripIndent } = require('common-tags');

module.exports = (ctx) => {
	const filename = _.kebabCase(ctx.name);

	const body = stripIndent`
    version       = "0.0.0"
    author        = "${ctx.author}"
    description   = "${ctx.name}, a Godot game"
    license       = "MIT"
    bin           = @["${filename}"]

    requires "godot >= 0.4.1 & < 0.5.0"

    task make, "build":
      const bitsPostfix = when sizeof(int) == 8: "_64" else: "_32"
      const libFile =
        when defined(windows):
          "nim" & bitsPostfix & ".dll"
        elif defined(ios):
          "nim_ios.dylib"
        elif defined(macosx):
          "nim_mac.dylib"
        elif defined(android):
          "nim_android.so"
        elif defined(linux):
          "nim_linux" & bitsPostfix & ".so"
        else: nil
      if libFile.isNil:
        raise newException(OSError, "Unsupported platform")

      exec "nimble build -y"
      const dir = "../_dlls/"
      const target = dir & libFile
      mkDir(dir)
      when defined(windows):
        rmFile(target)
        mvFile(bin[0] & ".exe", target)
      else:
        mvFile(bin[0], target)
	`;

	return {
		name: filename,
		body
	};
};
