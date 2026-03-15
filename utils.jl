using Bibliography

const SITE_BIB = import_bibtex(joinpath(@__DIR__, "_assets", "refs.bib"), check=:warn)

function format_apa_authors(e)
    authors = e.authors
    isempty(authors) && return ""

    add_period(s) = isempty(s) ? "" : (endswith(s, ".") ? s : string(s[1]) * ".")

    names = [begin
        last   = isempty(a.last)   ? "" : a.last
        first  = isempty(a.first)  ? "" : add_period(split(a.first)[1])
        middle = isempty(a.middle) ? "" : join([add_period(p) for p in split(a.middle) if !isempty(p)], " ")
        initials = filter(!isempty, [first, middle])
        isempty(initials) ? last : "$last, $(join(initials, " "))"
    end for a in authors]

    if length(names) == 1
        return names[1]
    elseif length(names) <= 20
        return join(names[1:end-1], ", ") * ", & " * names[end]
    else
        return join(names[1:19], ", ") * ", ... " * names[end]
    end
end

function format_apa_venue(e)
    journal = e.in.journal
    volume  = e.in.volume
    issue   = e.in.number
    pages   = e.in.pages

    isempty(journal) && return ""

    venue = "<em>$journal</em>"
    if !isempty(volume)
        venue *= ", <em>$volume</em>"
        isempty(issue) || (venue *= "($issue)")
    end
    isempty(pages) || (venue *= ", $pages")
    return venue
end

function hfun_references(keys)
    selected = select(SITE_BIB, keys)
    io = IOBuffer()
    write(io, "<div class=\"reference-list\">")
    for (i, key) in enumerate(keys)
        if !haskey(selected, key)
            write(io, "<p><em>Key '$key' not found in refs.bib</em></p>")
            continue
        end
        e = selected[key]

        authors  = format_apa_authors(e)
        title    = Bibliography.xtitle(e)
        year     = Bibliography.xyear(e)

        doi  = e.access.doi
        link = !isempty(doi) ? "https://doi.org/$doi" : Bibliography.xlink(e)
        is_arxiv = isempty(doi) && occursin("arxiv", lowercase(link))

        cite  = isempty(authors) ? "" : "$authors "
        cite *= "($year). "
        if is_arxiv
            cite *= "<em>$title</em>. arXiv."
        else
            venue_str = format_apa_venue(e)
            cite *= "$title"
            cite *= isempty(venue_str) ? "." : ". $venue_str."
        end
        isempty(link) || (cite *= " <a href=\"$link\" target=\"_blank\">$link</a>")

        write(io, """<p id="ref-$key"><span class="ref-num">[$i]</span> $cite</p>""")
    end
    write(io, "</div>")
    return String(take!(io))
end

function hfun_cite(key)
    k = key[1]
    haskey(SITE_BIB, k) || return "<sup><em>[?]</em></sup>"
    # find index of this key on the current page
    page_refs = locvar("refs")
    i = findfirst(==(k), page_refs)
    i === nothing && return "<sup><em>[?]</em></sup>"
    return """<sup><a href="#ref-$k">[$i]</a></sup>"""
end

function hfun_bar(vname)
  val = Meta.parse(vname[1])
  return round(sqrt(val), digits=2)
end

function hfun_m1fill(vname)
  var = vname[1]
  return pagevar("index", var)
end

function lx_baz(com, _)
  # keep this first line
  brace_content = Franklin.content(com.braces[1]) # input string
  # do whatever you want here
  return uppercase(brace_content)
end
