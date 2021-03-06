# Ginseng

Ginseng is a web app for learning things with flashcards and spaced repetition. Think Anki, but different. Hosted on [eatginseng.com](http://www.eatginseng.com/).

- 100% in browser client-side Javascript, built with [React](http://facebook.github.io/react/)
- Data stored in single JSON file. Can be synced over Dropbox or saved in the browser
- Complete control over review intervals. Not bound to "difficulty"
- Each information isn't bound to a fixed "deck" but rather can have any number of "tags"
- Profiles create the reviews based on tags, types, due date and creation date
- Native Markdown and LaTeX support for content and templates

## How it works
The thing you want to learn/memorize is called an **Info**. Ginseng works with virtual flashcards, which means you supply questions or cues for the "front" of the card and should remember what the answer on the back looks like.

Infos are of a certain **type** that define the number of **entries** of the info as well as **templates**. A typical type would define two entries called *front* and *back*. For example an Info of that type could be made of an English word and the Spanish translation. An Info can also contain any number of tags, more on that later. Example Infos:

![](https://github.com/s9w/Ginseng/raw/master/doc/infos.png)

Info entries can not only be simple text but can contain [Markdown](http://en.wikipedia.org/wiki/Markdown) as well as [LaTeX](http://en.wikipedia.org/wiki/LaTeX) expressions between dollar signs like in the third example.

### Templates
To display an info on screen you'll need to define how it's supposed to look. That's what templates are for. Templates consist of two Markdown expressions. One for the front and one for the back of the virtul flash card. In that expression, the entries of the info can be accessed with curly braces like `{front}` or `{country}` if the info type has an entry called country. Since templates use the specific structure of a an Info type, they're bound to them. So each Info type can have one or more templates. Example template:

![](https://github.com/s9w/Ginseng/raw/master/doc/templates.png)

Templates can also contain Markdown and LaTeX expressions. 

Each templates can generate a review for one Info. Example of how a generated review might look like:

![](https://github.com/s9w/Ginseng/raw/master/doc/review.gif)

A common use of flashcard software is to ask for the reverse relation of the Info. This can easily be done by creating a second template with the appropriate changes. In addition to the front and back expressions, templates can also have a **condition**. The associated review will only be generated when that condition is met. Typically a reverse template would have a condition that the info would have a "reverse" tag. It'll be only generated for infos with that tag then. The complete condition syntax is described [below](#filter-syntax).

The general nature of the templates also make it trivial to display the contents of a `notes` entry alongside. Another more complex use case could be that you want to learn the worlds Countries and their capital city and spoken language. For that you would create an Info type with the entries `Country`, `Capital`, `Language` and whatever you desire. For that type you can create templates to ask for the capital of a given country, the country of a given capital, the language of a given country etc.

### Review
When reviewing a card, only the front is displayed initially. The back is revealed after the "Show backside" button press. Depending on your setting, a small form to type a guess is shown. The guess is then compared to the answer but the outcome has no effect on the review and is only for self control.

When a card is reviewed for the first time, you have to set a time when it'll be be due again. The buttons are small and abbreviated but self-explanatory and made so they are easily hit on mobile devices. "5h% means 5 hours for example. Clicking once will select a choice and mark it green. The date and time of the next review is previewed on the bottom. Click again to confirm. That way you can preview the choices but also quickly apply the intervals with a double click.

If it's not the first time you review a card then you can either set an interval like above, or *change* the last interval. That change is based in the interval between your last review and the current time, NOT when the review would have been due. That's intentional as in reality you'll constantly be reviewing cards a bit after their due date and that should be what memory is based on.

The buttons in the change mode are similar but additionally have percentage increases. Should be self-explanatory I hope.

Each generated card has a "**dueness**" based on the selected interval and the time since the last review. Right after reviewing, the dueness is 0. It increases linearly with time, reaching 1.0 at the time of it's designated interval. That's when reviews are "due" and are displayed by default. It will continue to increase if it's not reviewed (and become "overdue" if you want to call it that). The reviews are sorted from most to least due cards.

### Profiles
With a growing collection of infos, more control over the reviews is helpful - that's what review **profiles** are for. They filter the generated flashcards by tags, creation date or type of their infos with the syntax described below. Profiles can also filter by dueness: A profile with a "due threshold" of less than 1.0 will show cards that are not due yet. That can be used as a "cramming mode" if you want.

### Filter syntax
- Infos can be filtered by their tags. `tag: math` matches all infos that have a `math` tag. This is case-sensitive and a precise match, so it will neither match a `Math` nor a `mathematics` tag.
- Filtering by the creation date of the info is also possible: `createdBefore: 2015-01-01` matches infos that are created before 2015. The format should be something [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601). See [here](http://momentjs.com/docs/#/parsing/string/) for technical details.
- Types can also be filtered. `type: "Languages"` matches infos with of type "Language". Note that this requires quotes around the type as whitespace is probably common in type names.
- Filter queries can be logically combined with Javascript Syntax. So `||` means "or", `&&` means and. Negations can be done with `!` and feel free to go wild with brackets. For example, `tag: math || tag: physics` matches all infos with either a math or a physics tag. And `!(tag: french) || tag: important` matches everything but french... unless it's important (tag-wise).
- These filters can be applied to the templates as well as review profiles!

## The Science
Ginseng is designed around some solid findings from cognitive psychology.

It's much more efficient to try to recall an information without access to the solution than trying to memorize it while staring at it - that's called the [testing effect](http://en.wikipedia.org/wiki/Testing_effect). The hidden back side is what makes flashcard practice so efficient.

The learning can also vastly be improved by distributing it over many separate session rather than doing it all in one - that's called the [spacing effect](http://en.wikipedia.org/wiki/Spacing_effect). This effect is especially big when the intervals increase each time. That's [Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) which is the basis for SRS (Spaced Repetition Software) like Anki or Ginseng. The exact timings of the intervals are tricky though and the conditions of the studies are rarely met in practice. That's why Ginseng offers such a fine grained control over the review interval: Just set the interval you feel is right.

The brain also likes to [link](http://gocognitive.net/interviews/effect-context-memory) information to location and other contextual factors. Things you know in the library might be "gone" during an exam. Ginseng is therefore a web app, designed to work well on mobile devices and with Dropbox sync to be accessable everywhere and from any computer with a web browser.

## Philosophy / Goals
Ginseng and the underlying data format are designed to be as open and robust as possible
- All data is saved in a straightforward human-readable (and therefore hackable) [JSON file](https://raw.githubusercontent.com/s9w/Ginseng/master/init_data.js).
- The formatting of the infos and templates is done in Markdown and LaTeX. Currently [marked](https://github.com/chjj/marked) is used for Markdown and [MathJax](https://github.com/mathjax/mathjax) for LaTeX rendering.
- Dates/times are saved in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601).

## Plans / issues
- Write an Anki importer?