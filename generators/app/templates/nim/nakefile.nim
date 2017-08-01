# Copyright 2017 Xored Software, Inc.

import nake
import os, ospaths, times
import godotapigen

proc genGodotApi() =
  let godotBin = getEnv("GODOT_BIN")
  if godotBin.isNil or godotBin.len == 0:
    echo "GODOT_BIN environment variable is not set"
    quit(-1)
  if not fileExists(godotBin):
    echo "Invalid GODOT_BIN path: " & godotBin
    quit(-1)

  const targetDir = "_godotapi"
  createDir(targetDir)
  const jsonFile = targetDir/"api.json"
  if not fileExists(jsonFile) or
     godotBin.getLastModificationTime() > jsonFile.getLastModificationTime():
    direShell(godotBin, "--gdnative-generate-json-api", jsonFile)
    if not fileExists(jsonFile):
      echo "Failed to generate api.json"
      quit(-1)

    genApi(targetDir, jsonFile)

task "build", "Builds the client for the current platform":
  genGodotApi()
  withDir "src":
    direShell("nimble", "make")

task "clean", "Remove files produced by build":
  removeDir(".nimcache")
  removeDir("src"/".nimcache")
  removeDir("_godotapi")
  removeDir("_dlls")
  removeFile("nakefile")
